using Microsoft.EntityFrameworkCore;
using Ordering.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ordering.DAL
{
    public class DBcontext : DbContext
    {
        public DBcontext(DbContextOptions opts) : base(opts)
        {

        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>().HasData(
                new Customer { ID = 1, Name = "Coca Cola", Since = new DateTime(2014, 6, 28), Revenue = 492.12M },
                new Customer { ID = 2, Name = "Teamleader", Since = new DateTime(2015, 1, 15), Revenue = 1505.95M },
                new Customer { ID = 3, Name = "Jeroen De Wit", Since = new DateTime(2016, 2, 11), Revenue = 0.0M }
            );

            modelBuilder.Entity<Product>().HasData(
                new Product { ID = 1, ProductCode = "A101", Description = "Screwdriver", Category = "1", Price = 9.75M },
                new Product { ID = 2, ProductCode = "A102", Description = "Electric Screwdriver", Category = "1", Price = 49.50M },
                new Product { ID = 3, ProductCode = "B101", Description = "Basic on-off switch", Category = "2", Price = 4.99M },
                new Product { ID = 4, ProductCode = "B102", Description = "Press Button", Category = "2", Price = 4.99M },
                new Product { ID = 5, ProductCode = "B103", Description = "Switch with motion detector", Category = "2", Price = 12.95M }
            );

            modelBuilder.Entity<Order>().HasData(
                new Order { ID = 1, CustomerId = 1, Total = 49.90M },
                new Order { ID = 2, CustomerId = 2, Total = 24.95M },
                new Order { ID = 3, CustomerId = 3, Total = 69.00M }
            );

            modelBuilder.Entity<OrderDetail>().HasData(
                new OrderDetail { ID = 1, OrderId = 1, ProductId = 4, Quantity = 10 },
                new OrderDetail { ID = 2, OrderId = 2, ProductId = 4, Quantity = 5 },
                new OrderDetail { ID = 3, OrderId = 3, ProductId = 1, Quantity = 2 },
                new OrderDetail { ID = 4, OrderId = 3, ProductId = 2, Quantity = 1 }
            );
        }
    }
}
