# backend/notes/views.py (最终权威修复版 V2)

from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import viewsets, generics, status # 导入 status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, Tag
from .serializers import NoteSerializer, TagSerializer, UserSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    # 【关键修改】: 我们不再使用 perform_create，而是完全重写 create 方法
    def create(self, request, *args, **kwargs):
        # 1. 使用序列化器验证前端传入的数据
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. 从验证过的数据中提取创建 Note 所需的字段
        #    注意：我们不从这里取 owner
        validated_data = serializer.validated_data
        
        # 3. 手动创建 Note 实例，并明确地传入 owner
        try:
            note = Note.objects.create(
                owner=request.user,
                title=validated_data.get('title', '无标题笔记'),
                content=validated_data.get('content', ''),
                # 其他字段使用模型的默认值
            )
        except Exception as e:
            # 如果创建失败，返回详细错误
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 4. 如果有标签数据 (tag_ids)，设置标签
        if 'tags' in validated_data:
            note.tags.set(validated_data['tags'])

        # 5. 将新创建的 Note 对象序列化后返回给前端
        response_serializer = self.get_serializer(note)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
    # ... (reorder action 保持不变) ...
    @action(detail=False, methods=['post'], url_path='reorder')
    @transaction.atomic
    def reorder(self, request):
        # ... reorder 的逻辑 ...
        return Response({"status": "Notes reordered successfully."})

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]