using CassandraConnector.Models;

namespace CassandraWebUI.Models
{
    public class Storage
    {
        public string? guid { get; set; }
        public string? name { get; set; }
        public string? hosts { get; set; }
        public string? keyspace { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public List<QueryStorage>? query { get; set; }
    }

    public class QueryStorage
    {
        public Query? query { get; set; }
        public string? guid { get; set; }
        public string? title { get; set; }
    }

    public class Connection 
    {
        public string? guid { get; set; }
        public string? name { get; set; }
        public string? hosts { get; set; }
        public string? keyspace { get; set; }
        public bool hasUnPw { get; set; }
    }
}
