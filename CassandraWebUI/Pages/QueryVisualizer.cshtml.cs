using CassandraConnector.DBMethods;
using CassandraWebUI.Constants;
using CassandraWebUI.Helpers;
using CassandraWebUI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System;
using System.IO;

namespace CassandraWebUI.Pages
{
    public class QueryVisualizerModel : PageModel
    {
        private readonly ILogger<QueryVisualizerModel> _logger;

        public QueryVisualizerModel(ILogger<QueryVisualizerModel> logger)
        {
            _logger = logger;
        }

        public Storage storage { get; set; }
        public string jsonUdfs { get; set; }

        public IActionResult OnGet(string id)
        {
            using (StreamReader r = new StreamReader(Path.GetFullPath(ConnectionConstants.connectionSavePath + "/" + id + ".json")))
            {
                string json = r.ReadToEnd();
                if (!string.IsNullOrEmpty(json))
                {
                    this.storage = JsonConvert.DeserializeObject<Storage>(json);
                }
            }

            if (this.storage != null)
            {
                try
                {
                    DBMethods dBMethods = new DBMethods(storage.hosts, storage.username, storage.password, storage.keyspace);
                    var udfs = dBMethods.GetUDFs();
                    if (udfs != null && udfs.Any())
                    {
                        jsonUdfs = JsonConvert.SerializeObject(udfs);
                    }
                }
                catch(Exception ex) { }
            }

            return Page();
        }
    }
}
