import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), './src/common/graphql/graphql.ts'),
      },
      playground: true,
    }),
    UserModule,
    AuthModule,
    WalletModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
