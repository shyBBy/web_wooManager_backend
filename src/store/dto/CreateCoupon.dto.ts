import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

export class CouponCreateDto {

    @IsString()
    code: string;

    @IsString()
    discount_type: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    date_expires: Date | string;

    @IsOptional()
    date_expires_gmt: Date | string;

    @IsOptional()
    individual_use: boolean;


    @IsOptional()
    @IsNumber()
    usage_limit_per_user: number;

    @IsString()
    amount: string;

    @IsOptional()
    @IsBoolean()
    exclude_sale_items: boolean;

    @IsOptional()
    @IsString()
    minimum_amount: string

}