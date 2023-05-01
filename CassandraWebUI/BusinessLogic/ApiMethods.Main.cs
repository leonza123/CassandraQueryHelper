using CassandraConnector.DBMethods;

namespace CassandraWebUI.BusinessLogic
{
    public partial class ApiMethods
    {
        private readonly ILogger logger;

        public ApiMethods(ILogger _logger) 
        {
            logger = _logger;
        }
    }
}
