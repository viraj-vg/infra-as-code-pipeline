variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name: dev, staging or prod"
  type        = string
}

variable "vpc_name" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "availability_zones" {
  type = list(string)
}

variable "aws_subnet1_public_cidr" {
  type = string
}

variable "aws_subnet1_private_cidr" {
  type = string
}

variable "aws_subnet2_public_cidr" {
  type = string
}

variable "aws_subnet2_private_cidr" {
  type = string
}

variable "app_port" {
  type = number
}

variable "log_retention_days" {
  type = number
}

variable "image_tag" {
  type = string
}

variable "task_cpu" {
  type = number
}

variable "task_memory" {
  type = number
}

variable "min_capacity" {
  type = number
}

variable "max_capacity" {
  type = number
}

variable "enable_deletion_protection" {
  type = bool
}

variable "ecr_force_delete" {
  type = bool
}