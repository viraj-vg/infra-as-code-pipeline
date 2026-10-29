output "alb_dns_name" {
  description = "DNS name of the load balancer. Open this in the browser"
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "task_definition_family" {
  value = aws_ecs_task_definition.app.family
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for backend and frontend"
  value       = { for k, v in aws_ecr_repository.app : k => v.repository_url }
}