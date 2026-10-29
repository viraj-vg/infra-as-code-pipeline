output "alb_dns_name" {
  description = "Open this address in the browser"
  value       = module.compute.alb_dns_name
}

output "ecs_cluster_name" {
  value = module.compute.ecs_cluster_name
}

output "ecs_service_name" {
  value = module.compute.ecs_service_name
}

output "ecr_repository_urls" {
  value = module.compute.ecr_repository_urls
}