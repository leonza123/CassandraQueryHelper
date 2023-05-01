using CassandraConnector.DBMethods;
using CassandraConnector.Models;
using CassandraConnector.QueryMethdos;
using CassandraWebUI.Constants;
using CassandraWebUI.Helpers;
using CassandraWebUI.Models;
using Newtonsoft.Json;

namespace CassandraWebUI.BusinessLogic
{
    public partial class ApiMethods
    {
        public string GetTables(ConnectionModel data)
        {
            TableSearchReturn returnData = new TableSearchReturn();

            try
            {
                DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);
                returnData.tables = dBMethods.GetTableNames(data.keyspace);
                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.GetTables error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string GetTableData(IncommingData data, string tableName)
        {
            TableDataReturn returnData = new TableDataReturn();

            try
            {
                if (data.query == null)
                    data.query = new Query { from = new From { table = tableName } };

                DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);
                returnData.tableData = dBMethods.GetTableData(data.keyspace, data.query);
                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.GetTableData error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string ExecuteCode(CodeInput data)
        {
            TableDataReturn returnData = new TableDataReturn();

            try
            {
                DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);
                returnData.tableData = dBMethods.GetDataByCode(data.code);
                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.ExecuteCode error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string SaveQuery(SaveQueryInput data)
        {
            QuerySaveReturn returnData = new QuerySaveReturn();

            try
            {
                if (data != null && !string.IsNullOrEmpty(data.guid) && data.query != null && !string.IsNullOrEmpty(data.title)) 
                {
                    string fullPath = FileHelper.GetFullPath(ConnectionConstants.connectionSavePath + "/" + data.guid + ".json");
                    var json = FileHelper.ReadFromFile(fullPath);
                    var existingData = JsonConvert.DeserializeObject<Storage>(json);

                    if (existingData.query == null)
                    {
                        returnData.queryGuid = Guid.NewGuid().ToString();
                        existingData.query = new List<QueryStorage>();

                        existingData.query.Add(new QueryStorage
                        {
                            query = data.query,
                            title = data.title,
                            guid = returnData.queryGuid,
                        });

                        FileHelper.WriteToFile(fullPath, JsonConvert.SerializeObject(existingData));
                    }
                    else 
                    {
                        if (!string.IsNullOrEmpty(data.queryGuid))
                        {
                            returnData.queryGuid = data.queryGuid;

                            var existingQuery = existingData.query.Where(x => x.guid == data.queryGuid).First();
                            existingQuery.query = data.query;
                            existingQuery.title = data.title;

                            FileHelper.WriteToFile(fullPath, JsonConvert.SerializeObject(existingData));
                        }
                        else
                        {
                            returnData.queryGuid = Guid.NewGuid().ToString();

                            existingData.query.Add(new QueryStorage
                            {
                                query = data.query,
                                title = data.title,
                                guid = returnData.queryGuid,
                            });

                            FileHelper.WriteToFile(fullPath, JsonConvert.SerializeObject(existingData));
                        }
                    }

                    returnData.status = true;
                }
                else
                {
                    returnData.status = false;
                    returnData.errorMessage = "Wrong data provided.";
                }
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.SaveQuery error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string DownloadQuery(IncommingData data)
        {
            FileReturn returnData = new FileReturn();

            try
            {
                DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);
                var columns = dBMethods.GetTableColumns(data.keyspace, data.query.from.table);

                QueryBuildHelper queryBuildHelper = new QueryBuildHelper();
                string query = queryBuildHelper.BuildQuery(data.query, columns, true);

                returnData.file = new FileData
                {
                    content = null,
                    name = "generated-query.txt",
                    contentType = "text/plain"
                };

                using (var ms = new MemoryStream())
                {
                    using (TextWriter tw = new StreamWriter(ms))
                    {
                        tw.Write(query);
                        tw.Flush();
                        ms.Position = 0;
                        returnData.file.content = ms.ToArray();
                    }
                }

                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.DownloadQuery error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string DownloadQueryResult(bool isCode, CodeInput data)
        {
            FileReturn returnData = new FileReturn();

            try
            {
                DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);

                string jsonResult = string.Empty;
                if (!isCode)
                    jsonResult = dBMethods.GetJSONTableData(data.keyspace, data.query);
                else
                    jsonResult = dBMethods.GetJSONTableDataByCode(data.code);

                returnData.file = new FileData
                {
                    content = null,
                    name = "generated-query-data.json",
                    contentType = "application/json"
                };

                using (var ms = new MemoryStream())
                {
                    using (TextWriter tw = new StreamWriter(ms))
                    {
                        tw.Write(jsonResult);
                        tw.Flush();
                        ms.Position = 0;
                        returnData.file.content = ms.ToArray();
                    }
                }

                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.DownloadQueryResult error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string GetQueries(string guid)
        {
            QueryListReturn returnData = new QueryListReturn();

            try
            {
                string fullPath = FileHelper.GetFullPath(ConnectionConstants.connectionSavePath + "/" + guid + ".json");
                var json = FileHelper.ReadFromFile(fullPath);
                var existingData = JsonConvert.DeserializeObject<Storage>(json);

                returnData.queries = existingData.query;
                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.GetQueries error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }

        public string LoadQuery(string guid, string queryGuid)
        {
            QueryDataReturn returnData = new QueryDataReturn();

            try
            {
                string fullPath = FileHelper.GetFullPath(ConnectionConstants.connectionSavePath + "/" + guid + ".json");
                var json = FileHelper.ReadFromFile(fullPath);
                var existingData = JsonConvert.DeserializeObject<Storage>(json);

                returnData.query = existingData.query.Where(x => x.guid == queryGuid).First();
                returnData.status = true;
            }
            catch (Exception ex)
            {
                returnData.status = false;
                returnData.errorMessage = ex.Message;
                logger.LogError(ex, "ApiMethods.LoadQuery error: " + ex.Message);
            }

            return JsonConvert.SerializeObject(returnData);
        }
    }
}
