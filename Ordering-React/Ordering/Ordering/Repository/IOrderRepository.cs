using Ordering.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ordering.Repository
{
    public interface IOrderRepository
    {
        IQueryable<Order> GetOrders();
        Order FindById(int OrderID);

        int AddOrder(Order order);
        void DeleteOrder(int OrderID);
        int UpdateOrder(Order order);

        IQueryable<Customer> GetCustomers();
        IQueryable<Product> GetProducts();

        void Dispose();
    }
}
