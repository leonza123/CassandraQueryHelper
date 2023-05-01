using CassandraConnector.Models;

namespace CassandraWebUI.Models
{

    public class FileReturn : SimpleReturn
    {
        public FileData? file { get; set; }
    }

    public class QuerySaveReturn : SimpleReturn
    { 
        public string? queryGuid { get; set; }
    }

    public class ConnectionModel
    {
        public string? name { get; set; }
        public string? hosts { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public string? keyspace { get; set; }
    }

    public class QueryDataReturn : SimpleReturn
    {
        public QueryStorage? query { get; set; }
    }

    public class QueryListReturn : SimpleReturn
    {
        public List<QueryStorage>? queries { get; set; }
    }

    public class TableDataReturn : SimpleReturn 
    {
        public TableData? tableData { get; set; }
    }

    public class TableSearchReturn : SimpleReturn 
    {
        public List<string>? tables { get; set; }
    }

    public class CreatedConnectionReturn : SimpleReturn
    {
        public Storage? connection { get; set; }
    }

    public class CodeInput : IncommingData
    {
        public string? code { get; set; }
    }

    public class IncommingData
    {
        public string? guid { get; set; }
        public string? name { get; set; }
        public string? hosts { get; set; }
        public string? keyspace { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public Query? query { get; set; }
    }

    public class SaveQueryInput
    {
        public string? guid { get; set; }
        public string? queryGuid { get; set; }
        public string? title { get; set; }
        public Query? query { get; set; }
    }
}
