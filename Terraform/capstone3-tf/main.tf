terraform {
  backend "s3" {
    bucket       = "capstone-3-state"
    key          = "statefiles/terraform.tfstate"
    region       = "ap-south-1"
    use_lockfile = true
    encrypt      = true
  }
}

module "networking" {
  source = "../modules/networking"

  vpc_name                 = var.vpc_name
  vpc_cidr                 = var.vpc_cidr
  availability_zones       = var.availability_zones
  aws_subnet1_public_cidr  = var.aws_subnet1_public_cidr
  aws_subnet1_private_cidr = var.aws_subnet1_private_cidr
  aws_subnet2_public_cidr  = var.aws_subnet2_public_cidr
  aws_subnet2_private_cidr = var.aws_subnet2_private_cidr
}

module "security" {
  source = "../modules/security"

  environment = var.environment
  vpc_id      = module.networking.vpc_id
  app_port    = var.app_port
}

module "monitoring" {
  source = "../modules/monitoring"

  environment        = var.environment
  log_retention_days = var.log_retention_days
}

module "compute" {
  source = "../modules/compute"

  environment = var.environment
  aws_region  = var.aws_region
  app_port    = var.app_port
  image_tag   = var.image_tag

  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids

  alb_security_group_id       = module.security.alb_security_group_id
  ecs_tasks_security_group_id = module.security.ecs_tasks_security_group_id
  task_execution_role_arn     = module.security.task_execution_role_arn
  task_role_arn               = module.security.task_role_arn

  backend_log_group_name  = module.monitoring.backend_log_group_name
  frontend_log_group_name = module.monitoring.frontend_log_group_name

  task_cpu                   = var.task_cpu
  task_memory                = var.task_memory
  min_capacity               = var.min_capacity
  max_capacity               = var.max_capacity
  enable_deletion_protection = var.enable_deletion_protection
  ecr_force_delete           = var.ecr_force_delete
}