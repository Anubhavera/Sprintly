import graphene

from projects.schema import Query as ProjectsQuery, Mutation as ProjectsMutation


class Query(ProjectsQuery, graphene.ObjectType):
    pass


class Mutation(ProjectsMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
