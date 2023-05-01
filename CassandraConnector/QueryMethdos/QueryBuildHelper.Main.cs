using CassandraConnector.Constants;
using CassandraConnector.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace CassandraConnector.QueryMethdos
{
    public partial class QueryBuildHelper
    {
        public string queryResult { get; set; } = QueryConstants.mainStructure;
        public List<Column> columns { get; set; }
        private bool forDownload { get; set; } = false;
        private string selectStructure { get; set; }

        public QueryBuildHelper() {}

        private void ReplaceUnassignedParts()
        {
            this.queryResult = this.queryResult.Replace(QueryConstants.selectElem, selectStructure.Replace(QueryConstants.queryStructureReplacer, QueryConstants.selectAllSymbol))
                                               .Replace(QueryConstants.whereElem, string.Empty)
                                               .Replace(QueryConstants.groupByElem, string.Empty)
                                               .Replace(QueryConstants.orderByElem, string.Empty);
        }

        private void BuildSelectPart(List<Select> selects, bool hasGroup)
        {
            bool allSelect = false;
            if (!hasGroup && selects.Count == this.columns.Count)
                allSelect = true;

            //remove unused columns
            foreach(var column in this.columns) 
            {
                if (!selects.Any(y => y.column == column.column_name))
                    column.show = false;
                else
                    column.show = true;
            }

            foreach (var column in this.columns)
            {
                if (selects.Any(x => x.column == column.column_name))
                {
                    column.display_name = selects.Where(x => x.column == column.column_name).First().newName;
                }
            }

            //add to columns necessary for group
            if (hasGroup)
            {
                //for group column
                var unSpecifiedColumns = selects.Where(x => !this.columns.Any(y => y.column_name == x.column)).ToList();
                foreach (var unSpecifiedColumn in unSpecifiedColumns)
                    this.columns.Add(new Column
                    {
                        column_name = unSpecifiedColumn.column,
                        display_name = unSpecifiedColumn.newName,
                        type = DataTypeConstants.numberType,
                        groupCol = true,
                        show = true
                    });
            }
            else
            {
                if (allSelect)
                {
                    string tempSelect = selectStructure.Replace(QueryConstants.queryStructureReplacer, QueryConstants.selectAllSymbol);
                    this.queryResult = this.queryResult.Replace(QueryConstants.selectElem, tempSelect);
                }
                else
                {
                    string tempSelect = selectStructure;

                    if (selects.First().column == selects.First().newName || !forDownload)
                        tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, selects.First().column + QueryConstants.queryStructureReplacer);
                    else
                        tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, $"{selects.First().column} {QueryConstants.asPart} \"{selects.First().newName}\" {QueryConstants.queryStructureReplacer}");

                    for (var i = 1; i != selects.Count; i++)
                    {
                        if (selects[i].column == selects[i].newName || !forDownload)
                            tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, "," + selects[i].column + QueryConstants.queryStructureReplacer);
                        else
                            tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, $",{selects[i].column} {QueryConstants.asPart} \"{selects[i].newName}\" {QueryConstants.queryStructureReplacer}");
                    }
                    tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, string.Empty);
                    this.queryResult = this.queryResult.Replace(QueryConstants.selectElem, tempSelect);
                }
            }
        }

        private void BuildWherePart (List<Filter> filters) 
        {
            string tempWhere = QueryConstants.whereStructure;
            foreach (var filter in filters)
            {
                string tempType = columns.Where(x => x.column_name == filter.column).First().type;
                string tempQuote = (tempType == DataTypeConstants.textType) ? "'" : string.Empty;

                //IN operands case for '(' ... ')'
                if (filter.operand == QueryConstants.in_operand)
                {
                    string tempInput = tempQuote + filter.inputs.First() + tempQuote;
                    for (var i = 1; i != filter.inputs.Count; i++)
                    {
                        var tempVar = tempQuote + filter.inputs[i] + tempQuote;
                        tempInput += ", " + tempVar;
                    }
                    tempInput = "(" + tempInput + ")";
                    string tempReplacer = $"{filter.relation} {filter.column} {filter.operand} {tempInput}";
                    tempWhere = tempWhere.Replace(QueryConstants.queryStructureReplacer, $"{tempReplacer} {QueryConstants.queryStructureReplacer}");
                }
                //other cases
                else
                {
                    string tempInput = tempQuote + filter.input + tempQuote;
                    string tempReplacer = $"{filter.relation} {filter.column} {filter.operand} {tempInput}";
                    tempWhere = tempWhere.Replace(QueryConstants.queryStructureReplacer, $"{tempReplacer} {QueryConstants.queryStructureReplacer}");
                }
            }
            tempWhere = tempWhere.Replace(QueryConstants.queryStructureReplacer, string.Empty);
            this.queryResult = this.queryResult.Replace(QueryConstants.whereElem, tempWhere);
        }

        private void BuildGroupPart(Group group, bool hasSelect)
        {
            //select part
            string groupColName = $"{group.function.ToLower()}_{group.column}";
            if (this.columns.Any(x => x.column_name == groupColName))
                groupColName = this.columns.Where(x => x.column_name == groupColName).First().display_name;

            string tempSelect = selectStructure.Replace(QueryConstants.queryStructureReplacer, $"{group.function}({group.column}) {QueryConstants.asPart} {groupColName}{QueryConstants.queryStructureReplacer}");

            //group by part
            if (group.by != null && group.by.Any())
            {
                string tempGroup = QueryConstants.groupByStructure.Replace(QueryConstants.queryStructureReplacer, group.by.First() + QueryConstants.queryStructureReplacer);
                if (this.columns.Any(x => x.column_name == group.by.First() && x.show))
                    tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, $", {group.by.First()}{QueryConstants.queryStructureReplacer}");
                
                for (var i = 1; i != group.by.Count; i++)
                {
                    tempGroup = tempGroup.Replace(QueryConstants.queryStructureReplacer, $", {group.by[i]}{QueryConstants.queryStructureReplacer}");
                    if (this.columns.Any(x => x.column_name == group.by[i] && x.show))
                        tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, $", {group.by[i]}{QueryConstants.queryStructureReplacer}");
                }
                tempGroup = tempGroup.Replace(QueryConstants.queryStructureReplacer, string.Empty);
                this.queryResult = this.queryResult.Replace(QueryConstants.groupByElem, tempGroup);

                columns = columns.Where(x => group.by.Any(y => y == x.column_name)).ToList();

                //for select
                if (!this.columns.Any(x => x.column_name == groupColName) && !hasSelect)
                    columns.Add(new Column { column_name = groupColName, display_name = groupColName, type = DataTypeConstants.numberType, groupCol = true, show = true });
            }
            else
            {
                //for select
                if (!this.columns.Any(x => x.column_name == groupColName) && !hasSelect)
                    columns = new List<Column> { new Column { column_name = groupColName, display_name = groupColName, type = DataTypeConstants.numberType, groupCol = true, show = true } };
            }

            tempSelect = tempSelect.Replace(QueryConstants.queryStructureReplacer, string.Empty);
            this.queryResult = this.queryResult.Replace(QueryConstants.selectElem, tempSelect);
        }

        private void BuildSortPart(List<Sort> sorters)
        {
            string tempOrder = QueryConstants.orderByStructure;
            tempOrder = tempOrder.Replace(QueryConstants.queryStructureReplacer, $"{sorters.First().column} {sorters.First().direction}{QueryConstants.queryStructureReplacer}");

            if (sorters.Count > 1)
            {
                for (var i = 1; i != sorters.Count; i++)
                {
                    tempOrder = tempOrder.Replace(QueryConstants.queryStructureReplacer, $", {sorters[i].column} {sorters[i].direction}{QueryConstants.queryStructureReplacer}");
                }
            }

            tempOrder = tempOrder.Replace(QueryConstants.queryStructureReplacer, string.Empty);
            this.queryResult = this.queryResult.Replace(QueryConstants.orderByElem, tempOrder);
        }

        public string BuildQuery(Query query, List<Column> columns, bool forDownload = false, bool json = false)
        {
            //to modify created list
            this.columns = columns;
            this.forDownload = forDownload;

            //for download as json
            if (!json)
                selectStructure = QueryConstants.selectStructure;
            else
                selectStructure = QueryConstants.selectStructure_JSON;

            if (query.from != null)
                this.queryResult = this.queryResult.Replace(QueryConstants.fromElem, QueryConstants.fromStructure.Replace(QueryConstants.queryStructureReplacer, query.from.table));

            if (query.select != null)
                BuildSelectPart(query.select, query.group != null);

            if (query.group != null)
                BuildGroupPart(query.group, query.select != null);

            if (query.filter != null)
                BuildWherePart(query.filter);

            if (query.sort != null)
                BuildSortPart(query.sort);

            ReplaceUnassignedParts();

            if (!forDownload)
            {
                this.queryResult += QueryConstants.limitPart;
            }

            this.queryResult += QueryConstants.allowFilteringPart;

            return this.queryResult;
        }
    }
}
