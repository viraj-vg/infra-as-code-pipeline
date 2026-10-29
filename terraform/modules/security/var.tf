variable "vpc_id" {
  description = "The ID of the VPC where the security group will be created"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging or prod). Used in names and tags"
  type        = string
}

variable "app_port" {
  description = "Port the frontend container listens on"
  type        = number
}