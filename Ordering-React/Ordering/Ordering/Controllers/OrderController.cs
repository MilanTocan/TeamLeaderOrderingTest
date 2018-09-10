using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ordering.Models;
using Ordering.Repository;

namespace Ordering.Controllers
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository Repo;
        public OrderController(IOrderRepository repo)
        {
            Repo = repo;
        }

        // Order list
        [HttpGet]
        [Route("api/Order/GetOrders")]
        public ActionResult<IEnumerable<Order>> Get()
            => Ok(Repo.GetOrders());

        [HttpGet]
        [Route("api/Order/{id}")]
        public ActionResult<Order> GetById(int id)
            => Ok(Repo.FindById(id));

        // Create order
        [HttpGet]
        [Route("api/Order/New")]
        public ActionResult<OrderViewModel> NewOrder()
        {
            var customers = Repo.GetCustomers();
            OrderViewModel ovm = new OrderViewModel
            {
                Products = Repo.GetProducts(),
                Customers = customers,
                OrderData = new Order { CustomerId = customers.First().ID, OrderDetails = new List<OrderDetail>(), Total = 0M }
            };
            return Ok(ovm);
        }

        [HttpPost]
        [Route("api/Order/New")]
        public ActionResult<int> CreateOrder(Order order)
            => Ok(Repo.AddOrder(order));

        // Edit Order
        [HttpGet]
        [Route("api/Order/Edit/{id}")]
        public ActionResult<OrderViewModel> GetEditData(int id)
        => Ok(new OrderViewModel
        {
            Customers = Repo.GetCustomers(),
            Products = Repo.GetProducts(),
            OrderData = Repo.FindById(id)
        });

        [HttpPut]
        [Route("api/Order/Edit/{id}")]
        public ActionResult<OrderViewModel> UpdateOrder(Order o)
        {
            Repo.UpdateOrder(o);
            return NoContent();
        }

        // Delete order
        [HttpDelete]
        [Route("api/Order/Delete/{id}")]
        public ActionResult DeleteOrder(int id)
        {
            Repo.DeleteOrder(id);
            return Ok(id);
        }
    }
}