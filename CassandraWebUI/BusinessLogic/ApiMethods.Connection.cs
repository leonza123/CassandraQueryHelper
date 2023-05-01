using CassandraConnector.DBMethods;
using CassandraWebUI.Constants;
using CassandraWebUI.Helpers;
using CassandraWebUI.Models;
using Microsoft.AspNetCore.Connections;
using Newtonsoft.Json;
using System;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace CassandraWebUI.BusinessLogic
{
    public partial class ApiMethods
    {
        public string AddConnection(string existGuid, ConnectionModel data) 
        {
            CreatedConnectionReturn returnData = new CreatedConnectionReturn();

            try 
            {
                if (data != null && !string.IsNullOrEmpty(data.name))
                {
                    DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);

                    if (string.IsNullOrEmpty(existGuid))
                    {
                        Guid guid = Guid.NewGuid();

                        Storage storage = new Storage
                        {
                            guid = guid.ToString(),
                            name = data.name,
                            hosts = data.hosts,
                            username = data.username,
                            password = data.password,
                            keyspace = data.keyspace
                        };

                        string jsonData = JsonSerializer.Serialize(storage);

                        FileHelper.CreateDirectory(ConnectionConstants.connectionSavePath);
                        FileHelper.WriteToFile(Path.GetFullPath(ConnectionConstants.connectionSavePath + "/" + guid + ".json"), jsonData);

                        returnData.connection = storage;
                        returnData.status = true;
                    }
                    else 
                    {
                        string fullPath = FileHelper.GetFullPath(ConnectionConstants.connectionSavePath + "/" + existGuid + ".json");
                        if (FileHelper.FileExists(fullPath))
                        {
                            var json = FileHelper.ReadFromFile(fullPath);
                            var tempConn = JsonConvert.DeserializeObject<Storage>(json);
                            tempConn.name = data.name;
                            tempConn.hosts = data.hosts;
                            tempConn.username = data.username;
                            tempConn.password = data.password;
                            tempConn.keyspace = data.keyspace;

                            string jsonData = JsonSerializer.Serialize(tempConn);
                            FileHelper.WriteToFile(fullPath, jsonData);

                            returnData.connection = tempConn;
                            returnData.status = true;
                        }
                        else
                        {
                            returnData.status = false;
                            returnData.errorMessage = "Wrong data provided.";
                        }
                    }

                }
                else 
                {
                    returnData.status = false;
                    returnData.errorMessage = "No all necessary parameters provided.";
                }
            }
            catch(Exception ex) 
            {
                returnData.errorMessage = ex.Message;
                returnData.status = false;
                logger.LogError(ex, "ApiMethods.AddConnection error: " + ex.Message);
            }

            return JsonSerializer.Serialize(returnData);
        }

        public string GetConnection(string guid)
        {
            CreatedConnectionReturn returnData = new CreatedConnectionReturn();

            try
            {
                string fullPath = FileHelper.GetFullPath(ConnectionConstants.connectionSavePath + "/" + guid + ".json");
                if (FileHelper.FileExists(fullPath))
                {
                    var json = FileHelper.ReadFromFile(fullPath);
                    returnData.connection = JsonConvert.DeserializeObject<Storage>(json);
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
                logger.LogError(ex, "ApiMethods.Connect error: " + ex.Message);
            }

            return JsonSerializer.Serialize(returnData);
        }

        public string TestConnection(ConnectionModel data)
        {
            SimpleReturn returnData = new SimpleReturn();

            try
            {
                if (data != null && !string.IsNullOrEmpty(data.name))
                {
                    DBMethods dBMethods = new DBMethods(data.hosts, data.username, data.password, data.keyspace);
                    returnData.status = true;
                }
                else
                {
                    returnData.status = false;
                }
            }
            catch (Exception ex)
            {
                returnData.status = false;
                logger.LogError(ex, "ApiMethods.TestConnection error: " + ex.Message);
            }

            return JsonSerializer.Serialize(returnData);
        }

        public string DeleteConnection(string guid)
        {
            SimpleReturn returnData = new SimpleReturn();

            try
            {
                if (!string.IsNullOrEmpty(guid))
                {
                    string fullPath = FileHelper.GetFullPath(ConnectionConstants.connectionSavePath + "/" + guid + ".json");
                    File.Delete(fullPath);
                    returnData.status = true;
                }
                else
                {
                    returnData.status = false;
                }
            }
            catch (Exception ex)
            {
                returnData.status = false;
                logger.LogError(ex, "ApiMethods.DeleteConnection error: " + ex.Message);
            }

            return JsonSerializer.Serialize(returnData);
        }
    }
}
