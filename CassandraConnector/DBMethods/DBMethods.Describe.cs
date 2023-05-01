using Cassandra;
using Cassandra.Data.Linq;
using CassandraConnector.Constants;
using CassandraConnector.Models;
using CassandraConnector.QueryMethdos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CassandraConnector.DBMethods
{
    public partial class DBMethods
    {
        public List<string> GetTableNames(string keyspace) 
        {
            var res = session.Execute("SELECT keyspace_name, table_name FROM system_schema.tables WHERE keyspace_name = '" + keyspace + "';");

            var tables = new List<string>();

            foreach (var row in res)
            {
                var value = row.GetValue<string>("table_name");
                tables.Add(value);
            }

            return tables;
        }

        public List<Column> GetTableColumns(string keyspace, string table)
        {
            var res = session.Execute("SELECT column_name, type FROM system_schema.columns WHERE keyspace_name = '" + keyspace + "' AND table_name='" + table + "';");

            var tableData = new List<Column>();

            foreach (var row in res)
            {
                Column column = new Column
                {
                    column_name = row.GetValue<string>("column_name"),
                    display_name = row.GetValue<string>("column_name"),
                    type = queryBuildHelper.GetColumnType(row.GetValue<string>("type")),
                    groupCol = false,
                    show = true
                };

                tableData.Add(column);
            }

            return tableData;
        }

        public List<string> GetUDFs()
        {
            List<string> udfs = new List<string>();

            var rs = session.Execute(@"DESCRIBE FUNCTIONS;");
            foreach (var item in rs)
            {
                var name = item.GetValue<string>("name").ToString();
                var formattedName = Regex.Replace(name, @" ?\(.*?\)", string.Empty);
                udfs.Add(formattedName);
            }

            return udfs;
        }

        public TableData GetDataByCode(string query)
        {
            //to set limit
            if (!query.ToLower().Contains("LIMIT"))
                query = query.Remove(query.Length - 1, 1) + QueryConstants.limitPart + ";";

            RowSet unfixedData = session.Execute(query);

            TableData tableData = new TableData
            {
                columnData = unfixedData.Columns.Select(x => new Column { column_name = x.Name, display_name = x.Name }).ToList(),
                columnValues = new List<List<string>>()
            };

            foreach (var unfixedDataRow in unfixedData)
            {
                var tempValList = new List<string>();
                foreach (var columnD in tableData.columnData)
                {
                    Type columnType = unfixedData.Columns.Where(x => x.Name == columnD.column_name).Select(x => x.Type).First();
                    //for list, map and set
                    if (!columnType.IsPrimitive)
                    {
                        tempValList.Add(JsonSerializer.Serialize(unfixedDataRow.GetValue(columnType, columnD.column_name)));
                    }
                    else
                    {
                        tempValList.Add(unfixedDataRow.GetValue(columnType, columnD.column_name).ToString());
                    }
                }
                tableData.columnValues.Add(tempValList);
            }

            return tableData;
        }

        public TableData GetTableData(string keyspace, Query query) 
        {
            var columns = GetTableColumns(keyspace, query.from.table);
            TableData tableData = new TableData
            {
                columnData = columns,
                columnValues = new List<List<string>>()
            };

            RowSet unfixedData = session.Execute(queryBuildHelper.BuildQuery(query, tableData.columnData));
            tableData.columnData = queryBuildHelper.columns;

            foreach (var unfixedDataRow in unfixedData) 
            {
                var tempValList = new List<string>();
                foreach (var columnD in tableData.columnData.Where(x => x.show).ToList())
                {
                    var columnType = unfixedData.Columns.Where(x => x.Name == columnD.column_name).Select(x => x.Type).First();
                    if (columnD.type == DataTypeConstants.mapType || columnD.type == DataTypeConstants.listType || columnD.type == DataTypeConstants.setType)
                    {
                        tempValList.Add(JsonSerializer.Serialize(unfixedDataRow.GetValue(columnType, columnD.column_name)));
                    }
                    else
                    {
                        tempValList.Add(unfixedDataRow.GetValue(columnType, columnD.column_name).ToString());
                    }
                }
                tableData.columnValues.Add(tempValList);
            }

            return tableData;
        }

        public string GetJSONTableData(string keyspace, Query query)
        {
            var columns = GetTableColumns(keyspace, query.from.table);
            TableData tableData = new TableData
            {
                columnData = columns,
                columnValues = new List<List<string>>()
            };

            RowSet unfixedData = session.Execute(queryBuildHelper.BuildQuery(query, tableData.columnData, false, true));
            return unfixedData.First().GetValue<string>("[json]");
        }

        public string GetJSONTableDataByCode(string query)
        {
            //for AJAX and json export
            query = query.Replace("SELECT", "SELECT JSON");
            //to set limit
            if (!query.ToLower().Contains("LIMIT"))
                query = query.Remove(query.Length - 1, 1) + QueryConstants.limitPart + ";";

            RowSet unfixedData = session.Execute(query);
            return unfixedData.First().GetValue<string>("[json]");
        }
    }
}
