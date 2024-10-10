import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { join } from 'path';
import { ProjectsModule } from './projects/projects.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bullmq';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generate schema
      playground: true,
      subscriptions: {
        'subscriptions-transport-ws': true,
        'graphql-ws': {
          path: '/graphql',
          onConnect: (connectionParams) => {
            // const authToken = connectionParams.authToken;
            // if (!isValid(authToken)) {
            //   throw new Error('Token is not valid');
            // }
            // // extract user information from token
            // const user = parseToken(authToken);
            // // return user info to add them to the context later
            // return { user };
          },
        },
      },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, PubSub],
})
export class AppModule {}
