resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.environment}/backend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.environment}-backend-logs"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.environment}/frontend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.environment}-frontend-logs"
  }
}