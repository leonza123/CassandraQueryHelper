using CassandraConnector.Models;
using CassandraWebUI.BusinessLogic;
using CassandraWebUI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace CassandraWebUI.API
{
    public class CassandraAPI : Controller
    {
        private ApiMethods apiMethods;
        private readonly ILogger logger;

        public CassandraAPI(ILogger<CassandraAPI> _logger) 
        {
            logger = _logger ?? throw new ArgumentNullException(nameof(_logger));

            apiMethods = new ApiMethods(logger);
        }

        [Route("api/GetConnections")]
        [HttpGet]
        public bool GetSavedConnections()
        {
            return true;
        }

        [Route("api/AddConnection")]
        [HttpPost]
        public string AddConnection(string guid, [FromBody] ConnectionModel data) 
        {
            return apiMethods.AddConnection(guid, data);
        }

        [Route("api/DeleteConnection")]
        [HttpGet]
        public string DeleteConnection(string guid)
        {
            return apiMethods.DeleteConnection(guid);
        }

        [Route("api/TestConnection")]
        [HttpPost]
        public string TestConnection([FromBody] ConnectionModel data)
        {
            return apiMethods.TestConnection(data);
        }

        [Route("api/GetConnection")]
        [HttpGet]
        public string Connect(string guid)
        {
            return apiMethods.GetConnection(guid);
        }

        [Route("api/GetTables")]
        [HttpPost]
        public string GetTables([FromBody] ConnectionModel data)
        {
            return apiMethods.GetTables(data);
        }

        [Route("api/GetTableData")]
        [HttpPost]
        public string GetTableData([FromBody] IncommingData data, string tableName)
        {
            return apiMethods.GetTableData(data, tableName);
        }

        [Route("api/ExecuteCode")]
        [HttpPost]
        public string ExecuteCode([FromBody] CodeInput data)
        {
            return apiMethods.ExecuteCode(data);
        }

        [Route("api/SaveQuery")]
        [HttpPost]
        public string SaveQuery([FromBody] SaveQueryInput data)
        {
            return apiMethods.SaveQuery(data);
        }

        [Route("api/DownloadQuery")]
        [HttpPost]
        public string DownloadQuery([FromBody] IncommingData data)
        {
            return apiMethods.DownloadQuery(data);
        }

        [Route("api/DownloadQueryResult")]
        [HttpPost]
        public string DownloadQueryResult(bool codeQuery, [FromBody] CodeInput data)
        {
            return apiMethods.DownloadQueryResult(codeQuery, data);
        }

        [Route("api/GetQueries")]
        [HttpGet]
        public string GetQueries(string guid)
        {
            return apiMethods.GetQueries(guid);
        }

        [Route("api/LoadQuery")]
        [HttpGet]
        public string LoadQuery(string guid, string queryGuid)
        {
            return apiMethods.LoadQuery(guid, queryGuid);
        }
    }
}
