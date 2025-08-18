from rest_framework import viewsets, filters
from .models import Note, Tag
from .serializers import NoteSerializer, TagSerializer

class NoteViewSet(viewsets.ModelViewSet):
    """
    一个用于查看和编辑笔记的ViewSet。
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

class TagViewSet(viewsets.ModelViewSet):
    """
    一个用于查看和编辑标签的ViewSet。
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer