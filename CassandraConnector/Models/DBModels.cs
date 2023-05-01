using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CassandraConnector.Models
{
    public class TableData 
    {
        public List<Column> columnData { get; set; }
        public List<List<string>> columnValues { get; set; }
    }

    public class Column
    {
        public string column_name { get; set; }
        public string display_name { get; set; }
        public string type { get; set; }
        public bool groupCol { get; set; }
        public bool show { get; set; }
    }

    public class Query
    {
        public From from { get; set; }
        public List<Select> select { get; set; }
        public List<Sort> sort { get; set; }
        public List<Filter> filter { get; set; }
        public Group group { get; set; }
    }

    public class From 
    {
        public string table { get; set; }
    }

    public class Select 
    {
        public bool show { get; set; }
        public string column { get; set; }
        public string newName { get; set; }
    }

    public class Filter 
    {
        public string column { get; set; }
        public string operand { get; set; }
        public string input { get; set; }
        public List<string> inputs { get; set; }
        public string relation { get; set; }
    }

    public class Sort 
    {
        public string column { get; set; }
        public string direction { get; set; }
    }

    public class Group 
    {
        public string function { get; set; }
        public string column { get; set; }
        public List<string> by { get; set; }
    }
}
