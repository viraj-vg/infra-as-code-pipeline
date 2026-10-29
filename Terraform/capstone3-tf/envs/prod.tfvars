aws_region  = "ap-south-1"
environment = "prod"

vpc_name                 = "capstone-3-prod"
vpc_cidr                 = "10.2.0.0/16"
availability_zones       = ["ap-south-1a", "ap-south-1b"]
aws_subnet1_public_cidr  = "10.2.1.0/24"
aws_subnet1_private_cidr = "10.2.11.0/24"
aws_subnet2_public_cidr  = "10.2.2.0/24"
aws_subnet2_private_cidr = "10.2.12.0/24"

app_port           = 80
log_retention_days = 14
image_tag          = "initial"

task_cpu     = 512
task_memory  = 1024
min_capacity = 2
max_capacity = 6

enable_deletion_protection = true
ecr_force_delete           = false