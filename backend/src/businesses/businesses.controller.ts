import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new business' })
  create(@Body() createBusinessDto: CreateBusinessDto, @CurrentTenant() tenantId: string) {
    return this.businessesService.create(createBusinessDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
  findAll(@CurrentTenant() tenantId: string) {
    return this.businessesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.businessesService.findById(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update business' })
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.businessesService.update(id, updateBusinessDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete business' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.businessesService.remove(id, tenantId);
  }
}
