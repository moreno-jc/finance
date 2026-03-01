---
tags:
  - prompt
  - categorias
  - settings
created: '2026-03-01'
step: 7
---
# 🏷️ Prompt 07 — Categorías

Tags: #prompt #categorias #settings #crud

---

## 📋 Prompt

```
Implementa la gestión de categorías: listar, crear y editar categorías personalizadas.

## TAREA 1: categoryService

Crea src/services/categoryService.ts:

- getAll(userId: string): Promise<Category[]>
  → SELECT categorías del usuario + categorías default (is_default = true)
  → ORDER BY is_default DESC, name ASC
  
- getByType(userId: string, type: TransactionType): Promise<Category[]>
  → Filtra por tipo, incluye default + propias del usuario

- create(data: CreateCategoryInput): Promise<Category>
  CreateCategoryInput: { user_id, name, type, icon, color }

- update(id: string, data: Partial<CreateCategoryInput>): Promise<Category>

- delete(id: string): Promise<void>
  → Validar primero que no sea is_default (no se pueden borrar las predefinidas)
  → Si tiene transacciones → error con mensaje claro

## TAREA 2: categoryStore (Zustand)

Crea src/store/categoryStore.ts:

Estado:
- categories: Category[]
- isLoading: boolean

Acciones:
- fetchCategories(userId: string)
- addCategory(cat: Category)
- updateCategory(id: string, data: Partial<Category>)
- removeCategory(id: string)
- getCategoriesByType(type: TransactionType): Category[]  ← selector computado

## TAREA 3: Pantalla de Categorías

Crea app/(app)/settings/categories.tsx:

Layout:
- Header: "Mis Categorías" con botón + para crear nueva
- SectionList agrupado por tipo:
  INGRESOS / GASTOS / AHORROS / INVERSIONES / DEUDAS
- Cada sección muestra sus categorías con:
  - Punto o ícono coloreado con el color de la categoría
  - Nombre de la categoría
  - Badge "Sistema" en gris si is_default
  - Íconos editar/eliminar solo en categorías del usuario (no default)
- Swipe to delete en categorías propias (con confirmación)
- Empty state por sección si el usuario no tiene custom en ese tipo

## TAREA 4: Bottom Sheet / Modal para Crear/Editar Categoría

Crea src/components/ui/CategoryFormModal.tsx:

Modal de pantalla completa o bottom sheet con:

Campos:
1. Nombre (Input texto, requerido, max 30 chars)

2. Tipo (selector igual que en TransactionForm, 5 opciones):
   Solo activo en modo CREATE (en edición el tipo no cambia)

3. Color (paleta de 12 colores predefinidos en grid 4x3):
   Muestra círculos de color, el seleccionado tiene borde
   Colores: los mismos del theme por tipo + variantes

4. Ícono (grid de íconos de Ionicons):
   Mostrar 24 íconos relevantes (home, car, food, heart, plane, etc.)
   El seleccionado tiene fondo del color elegido

Vista previa en tiempo real:
- Muestra cómo se verá la categoría (ícono + nombre) mientras el usuario edita

Botones: Cancelar | Guardar
Validación: nombre no vacío, color seleccionado, ícono seleccionado

## TAREA 5: Integración con TransactionForm

Asegúrate de que el selector de categoría en TransactionForm:
- Obtiene las categorías del categoryStore
- Filtra por el tipo de transacción seleccionado
- Si el usuario crea una nueva categoría custom, aparece en el selector
- Muestra ícono + nombre + color de cada opción

## OUTPUT ESPERADO:
- Lista de categorías agrupadas por tipo, separando las del sistema y las propias
- Crear nueva categoría con nombre, tipo, color e ícono
- Editar categoría propia (nombre, color, ícono)
- Eliminar categoría propia (con confirmación y validación de uso)
- Las categorías custom aparecen disponibles en el formulario de transacciones
- Las categorías default no se pueden editar ni eliminar
```

---

## ✅ Verificación post-prompt

- [ ] Categorías del sistema visibles y marcadas como "Sistema"
- [ ] Crear categoría con color e ícono funciona
- [ ] Editar una categoría custom actualiza en lista y en formulario de transacciones
- [ ] Intentar eliminar categoría con transacciones muestra error descriptivo
- [ ] Las categorías custom aparecen en el formulario de nueva transacción

**Siguiente:** [[Prompt 08 - Graficas y Reportes]]

---

*[[README Prompts|← Índice de prompts]]*
