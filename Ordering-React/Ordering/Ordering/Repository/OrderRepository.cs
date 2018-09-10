using Microsoft.EntityFrameworkCore;
using Ordering.DAL;
using Ordering.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ordering.Repository
{
    public class OrderRepository : IOrderRepository
    {
        readonly DBcontext ctx;
        public OrderRepository(DBcontext c)
        {
            ctx = c;
        }

        public IQueryable<Order> GetOrders()
        {
            return ctx.Orders.Include(o => o.Customer).AsNoTracking();
        }

        public Order FindById(int OrderID)
        {
            return ctx.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .AsNoTracking()
                .SingleOrDefault(o => o.ID == OrderID);
        }

        public int AddOrder(Order order)
        {
            foreach(OrderDetail od in order.OrderDetails)
            {
                od.Product = null;
            }

            ctx.Orders.Add(order);
            ctx.SaveChanges();
            return order.ID;
        }

        public void DeleteOrder(int OrderID)
        {
            Order order = FindById(OrderID);
            ctx.Orders.Remove(order);
            ctx.SaveChanges();
        }

        public int UpdateOrder(Order order)
        {
            Order oldOrder = FindById(order.ID);
            oldOrder.CustomerId = order.CustomerId;

            foreach(OrderDetail od in order.OrderDetails)
            {
                if (od.ID > 0) // existing orderDetail
                {
                    ctx.Entry(od).State = EntityState.Modified;
                }
                else // new orderDetail
                {
                    ctx.Entry(od).State = EntityState.Added;
                }
            }

            foreach(OrderDetail od in oldOrder.OrderDetails)
            {
                if(!order.OrderDetails.ToList().Exists(d => d.ID == od.ID)) // remove details
                {
                    ctx.Entry(od).State = EntityState.Deleted;
                }
            }

            oldOrder.OrderDetails = order.OrderDetails;
            oldOrder.Total = order.Total;

            ctx.Entry(oldOrder).State = EntityState.Modified;
            ctx.SaveChanges();

            return order.ID;
        }
        
        public IQueryable<Customer> GetCustomers()
        {
            return ctx.Customers.AsNoTracking();
        }

        public IQueryable<Product> GetProducts()
        {
            return ctx.Products.AsNoTracking();
        }

        public void Dispose()
        {
            ctx.Dispose();
        }
    }
}
