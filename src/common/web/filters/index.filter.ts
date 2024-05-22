import { ExceptionFilter } from "@nestjs/common";
import {  InternalServerExceptionFilter } from "./internal-server-exception.filter";

export const exceptionFilters : ExceptionFilter[]= [
    new InternalServerExceptionFilter(),
]