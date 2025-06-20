import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FileUpload, FileText, Folder, Share2, Trash2, Edit2 } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'folder';
  url?: string;
  file?: File;
  disciplineId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newContent, setNewContent] = useState<Partial<Content>>({
    title: '',
    description: '',
    type: 'document',
  });

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines');
      return response.data;
    },
  });

  // Fetch content
  const { data: contents } = useQuery({
    queryKey: ['contents', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return [];
      const response = await api.get(`/contents?disciplineId=${selectedDiscipline}`);
      return response.data;
    },
    enabled: !!selectedDiscipline,
  });

  // Upload content mutation
  const uploadMutation = useMutation({
    mutationFn: async (content: Partial<Content>) => {
      const formData = new FormData();
      Object.entries(content).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      const response = await api.post('/contents', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      setShowUploadModal(false);
      setNewContent({ title: '', description: '', type: 'document' });
      toast({
        title: 'Conteúdo adicionado',
        description: 'O conteúdo foi adicionado com sucesso.',
      });
    },
  });

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async (contentId: string) => {
      await api.delete(`/contents/${contentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      toast({
        title: 'Conteúdo removido',
        description: 'O conteúdo foi removido com sucesso.',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewContent(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscipline) {
      toast({
        title: 'Erro',
        description: 'Selecione uma disciplina primeiro.',
        variant: 'destructive',
      });
      return;
    }
    uploadMutation.mutate({ ...newContent, disciplineId: selectedDiscipline });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Conteúdo</h1>
        <Button onClick={() => setShowUploadModal(true)}>
          <FileUpload className="mr-2 h-4 w-4" />
          Adicionar Conteúdo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Disciplinas</CardTitle>
            <CardDescription>Selecione uma disciplina para gerenciar seu conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplines?.map((discipline: any) => (
                  <SelectItem key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Visão geral do conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total de Conteúdos</p>
                <p className="text-2xl font-bold">{contents?.length || 0}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-2xl font-bold">
                  {contents?.[0]?.updatedAt
                    ? new Date(contents[0].updatedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedDiscipline && (
        <div className="mt-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contents?.map((content: Content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          <CardDescription>{content.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(content.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {content.type === 'document' && <FileText className="h-4 w-4" />}
                        {content.type === 'video' && <FileText className="h-4 w-4" />}
                        {content.type === 'link' && <FileText className="h-4 w-4" />}
                        {content.type === 'folder' && <Folder className="h-4 w-4" />}
                        <span>{content.type}</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Adicionar Conteúdo</CardTitle>
              <CardDescription>Preencha os detalhes do novo conteúdo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newContent.title}
                    onChange={e => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={newContent.description}
                    onChange={e => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={newContent.type}
                    onValueChange={value => setNewContent(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Documento</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="folder">Pasta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newContent.type !== 'link' && (
                  <div>
                    <label className="text-sm font-medium">Arquivo</label>
                    <Input type="file" onChange={handleFileChange} required />
                  </div>
                )}
                {newContent.type === 'link' && (
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      type="url"
                      value={newContent.url}
                      onChange={e => setNewContent(prev => ({ ...prev, url: e.target.value }))}
                      required
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={uploadMutation.isPending}>
                    {uploadMutation.isPending ? 'Adicionando...' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 