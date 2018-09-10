﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Ordering.Models
{
    public class Customer
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public DateTime Since { get; set; }

        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Revenue { get; set; }
    }
}
