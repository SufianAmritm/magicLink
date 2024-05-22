import { NestExpressApplication } from '@nestjs/platform-express';
import { API_CONSTANTS } from 'src/common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function getSwaggerConfiguration(
  app: NestExpressApplication,
) {
  const title = `${API_CONSTANTS.PROJECT_NAME}`;
  const description = `The ${API_CONSTANTS.PROJECT_NAME} API description`;
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, API_CONSTANTS.JWT)
    .addTag(`${API_CONSTANTS.PROJECT_NAME}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
