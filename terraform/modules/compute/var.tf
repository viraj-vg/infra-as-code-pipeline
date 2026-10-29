variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "alb_security_group_id" {
  type = string
}

variable "ecs_tasks_security_group_id" {
  type = string
}

variable "task_execution_role_arn" {
  type = string
}

variable "task_role_arn" {
  type = string
}

variable "backend_log_group_name" {
  type = string
}

variable "frontend_log_group_name" {
  type = string
}

variable "app_port" {
  description = "Port of the frontend container"
  type        = number
}

variable "image_tag" {
  description = "Image tag for the first task definition. The pipeline deploys new tags later"
  type        = string
}

variable "task_cpu" {
  description = "Fargate task CPU units, for example 512"
  type        = number
}

variable "task_memory" {
  description = "Fargate task memory in MB, for example 1024"
  type        = number
}

variable "min_capacity" {
  description = "Minimum number of tasks"
  type        = number
}

variable "max_capacity" {
  description = "Maximum number of tasks"
  type        = number
}

variable "enable_deletion_protection" {
  description = "Protect the load balancer from deletion"
  type        = bool
}

variable "ecr_force_delete" {
  description = "Allow Terraform to delete ECR repos that still have images"
  type        = bool
}