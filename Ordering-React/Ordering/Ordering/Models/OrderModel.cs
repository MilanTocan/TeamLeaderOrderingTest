using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Ordering.Models
{
    public class Order
    {
        public int ID { get; set; }
        
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        public IList<OrderDetail> OrderDetails { get; set; }

        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }
    }
}
