using CassandraConnector.Constants;
using CassandraConnector.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CassandraConnector.QueryMethdos
{
    public partial class QueryBuildHelper
    {
        public string GetColumnType(string cassandraType) 
        {
            switch (cassandraType.ToLower()) 
            {
                case "ascii":
                    return DataTypeConstants.textType;
                case "bigint":
                    return DataTypeConstants.numberType;
                case "blob":
                    return DataTypeConstants.textType;
                case "boolean":
                    return DataTypeConstants.booleanType;
                case "counter":
                    return DataTypeConstants.numberType;
                case "date":
                    return DataTypeConstants.textType;
                case "decimal":
                    return DataTypeConstants.numberType;
                case "double":
                    return DataTypeConstants.numberType;
                case "duration":
                    return DataTypeConstants.numberType;
                case "float":
                    return DataTypeConstants.numberType;
                case "inet":
                    return DataTypeConstants.textType;
                case "int":
                    return DataTypeConstants.numberType;
                case "smallint":
                    return DataTypeConstants.numberType;
                case "text":
                    return DataTypeConstants.textType;
                case "time":
                    return DataTypeConstants.textType;
                case "timestamp":
                    return DataTypeConstants.textType;
                case "timeuuid":
                    return DataTypeConstants.textType;
                case "tinyint":
                    return DataTypeConstants.numberType;
                case "uuid":
                    return DataTypeConstants.textType;
                case "varchar":
                    return DataTypeConstants.textType;
                case "varint":
                    return DataTypeConstants.numberType;
                case string s when s.StartsWith("map"):
                    return DataTypeConstants.mapType;
                case string s when s.StartsWith("set"):
                    return DataTypeConstants.setType;
                case string s when s.StartsWith("list"):
                    return DataTypeConstants.listType;
                default:
                    return DataTypeConstants.textType;
            }
        }
    }
}
