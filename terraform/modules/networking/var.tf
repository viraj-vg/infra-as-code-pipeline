
variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
}

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
}

variable "availability_zones" {
  description = "Two availability zones for the subnets"
  type        = list(string)
}

variable "aws_subnet1_public_cidr" {
  description = "The CIDR block for public the subnet 1"
  type        = string
}

variable "aws_subnet1_private_cidr" {
  description = "The CIDR block for private the subnet 1"
  type        = string
}

variable "aws_subnet2_public_cidr" {
  description = "The CIDR block for public the subnet 2"
  type        = string
}

variable "aws_subnet2_private_cidr" {
  description = "The CIDR block for private the subnet 2"
  type        = string
}

