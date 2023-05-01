using Cassandra;
using CassandraConnector.Models;
using CassandraConnector.QueryMethdos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CassandraConnector.DBMethods
{
    public partial class DBMethods
    {
        private ISession session { get; set; }
        private QueryBuildHelper queryBuildHelper { get; set; } 

        public DBMethods(string hosts, string username, string password, string keyspace)
        {
            var builder = Cluster.Builder()
                                 .AddContactPoints(hosts);

            //cannot provide empty username/password parameters
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                builder = builder.WithCredentials(username, password);

            var cluster = builder.Build();

            this.session = cluster.Connect(keyspace);

            queryBuildHelper = new QueryBuildHelper();
        }
    }
}
