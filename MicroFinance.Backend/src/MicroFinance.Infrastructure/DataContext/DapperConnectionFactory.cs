using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;

namespace MicroFinance.Infrastructure.DataContext
{
    public class DapperConnectionFactory
    {
        private readonly string _connectionString;

        public DapperConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}


