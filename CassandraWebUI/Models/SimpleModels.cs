namespace CassandraWebUI.Models
{
    public class SimpleReturn 
    {
        public bool status { get; set; }
        public string? errorMessage { get; set; }
    }

    public class FileData
    {
        public string? name { get; set; }
        public byte[]? content { get; set; }
        public string? contentType { get; set; }
    }
}
