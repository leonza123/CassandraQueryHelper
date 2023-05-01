using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CassandraConnector.Constants
{
    public class QueryConstants
    {
        public const string in_operand = "IN";

        //query builder constants
        public const string mainStructure = selectElem + fromElem + whereElem + groupByElem + orderByElem;

        public const string selectElem = "{SELECT}";
        public const string fromElem = "{FROM}";
        public const string whereElem = "{WHERE}";
        public const string groupByElem = "{GROUP_BY}";
        public const string orderByElem = "{ORDER_BY}";

        public const string selectStructure = " SELECT {0} ";
        public const string selectStructure_JSON = " SELECT JSON {0} ";
        public const string fromStructure = " FROM {0} ";
        public const string whereStructure = " WHERE {0} ";
        public const string groupByStructure = " GROUP BY {0} ";
        public const string orderByStructure = " ORDER BY {0} ";

        public const string queryStructureReplacer = "{0} ";
        public const string selectAllSymbol = "*";

        public const string asPart = "AS";
        public const string allowFilteringPart = " ALLOW FILTERING;";

        //for AJAX
        public const string limitPart = " LIMIT 3000";
    }
}
