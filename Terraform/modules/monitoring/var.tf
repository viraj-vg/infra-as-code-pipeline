variable "environment" {
  description = "Environment name (dev, staging or prod)"
  type        = string
}

variable "log_retention_days" {
  description = "How many days CloudWatch keeps the logs"
  type        = number
}