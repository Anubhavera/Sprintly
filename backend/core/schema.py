"""
Root GraphQL schema for Project Management System.
"""

import graphene

from projects.schema import Query as ProjectsQuery, Mutation as ProjectsMutation


class Query(ProjectsQuery, graphene.ObjectType):
    """Root query combining all app queries."""
    pass


class Mutation(ProjectsMutation, graphene.ObjectType):
    """Root mutation combining all app mutations."""
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
