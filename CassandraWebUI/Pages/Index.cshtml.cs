using CassandraWebUI.Constants;
using CassandraWebUI.Helpers;
using CassandraWebUI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace CassandraWebUI.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public List<Connection> connections { get; set; } = new List<Connection>();

        public IActionResult OnGet()
        {
            try
            {
                foreach(string path in FileHelper.GetFilePaths(ConnectionConstants.connectionSavePath)) 
                {
                    using (StreamReader r = new StreamReader(path))
                    {
                        string json = r.ReadToEnd();
                        var storage = JsonConvert.DeserializeObject<Storage>(json);
                        if (storage != null)
                        {
                            connections.Add(new Connection
                            {
                                guid = storage.guid,
                                name = storage.name,
                                hosts = storage.hosts,
                                keyspace = storage.keyspace,
                                hasUnPw = (!string.IsNullOrEmpty(storage.username) && !string.IsNullOrEmpty(storage.password)) ? true : false
                            });
                        }
                    }
                }
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }

            return Page();
        }
    }
}