resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = var.vpc_name
  }
}

resource "aws_subnet" "subnet1_public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.aws_subnet1_public_cidr
  availability_zone = var.availability_zones[0]

  tags = {
    Name = "${var.vpc_name}-subnet1-public"
  }
}

resource "aws_subnet" "subnet1_private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.aws_subnet1_private_cidr
  availability_zone = var.availability_zones[0]

  tags = {
    Name = "${var.vpc_name}-subnet1-private"
  }
}

resource "aws_subnet" "subnet2_public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.aws_subnet2_public_cidr
  availability_zone = var.availability_zones[1]

  tags = {
    Name = "${var.vpc_name}-subnet2-public"
  }
}

resource "aws_subnet" "subnet2_private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.aws_subnet2_private_cidr
  availability_zone = var.availability_zones[1]

  tags = {
    Name = "${var.vpc_name}-subnet2-private"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.vpc_name}-igw"
  }
}

resource "aws_eip" "nat_gw" {
  domain = "vpc"

  tags = {
    Name = "${var.vpc_name}-nat-eip"
  }
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_gw.id
  subnet_id     = aws_subnet.subnet1_public.id

  tags = {
    Name = "${var.vpc_name}-nat-gw"
  }

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.vpc_name}-public-rt"
  }
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }

  tags = {
    Name = "${var.vpc_name}-private-rt"
  }
}

resource "aws_route_table_association" "subnet1_public" {
  subnet_id      = aws_subnet.subnet1_public.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "subnet2_public" {
  subnet_id      = aws_subnet.subnet2_public.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "subnet1_private" {
  subnet_id      = aws_subnet.subnet1_private.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "subnet2_private" {
  subnet_id      = aws_subnet.subnet2_private.id
  route_table_id = aws_route_table.private_rt.id
}