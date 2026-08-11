"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { STATUS_COLUMNS, users } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { IssueStatus, IssueType, Priority } from "@/lib/types"

export function CreateIssueDialog() {
  const router = useRouter()
  const { createOpen, setCreateOpen, createIssue, projectKey, projectName } =
    useIssues()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<IssueType>("task")
  const [status, setStatus] = useState<IssueStatus>("todo")
  const [priority, setPriority] = useState<Priority>("medium")
  const [assigneeId, setAssigneeId] = useState<string>("unassigned")
  const [createAnother, setCreateAnother] = useState(false)

  function reset() {
    setTitle("")
    setDescription("")
    setType("task")
    setStatus("todo")
    setPriority("medium")
    setAssigneeId("unassigned")
  }

  function handleCreate() {
    if (!title.trim()) return

    const issue = createIssue({
      title: title.trim(),
      description: description.trim(),
      type,
      status,
      priority,
      assigneeId: assigneeId === "unassigned" ? null : assigneeId,
    })

    if (createAnother) {
      reset()
      return
    }

    setCreateOpen(false)
    reset()
    router.push(`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`)
  }

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100%-1.5rem)] overflow-y-auto sm:max-w-xl"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>Create issue</DialogTitle>
          <DialogDescription>
            Required fields are marked with an asterisk *.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>Project *</FieldLabel>
            <Input value={`${projectName} (${projectKey})`} disabled />
          </Field>

          <Field>
            <FieldLabel>Issue type *</FieldLabel>
            <Select
              value={type}
              onValueChange={(v) => setType((v as IssueType) ?? "task")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={status}
              onValueChange={(v) => setStatus((v as IssueStatus) ?? "todo")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {STATUS_COLUMNS.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Summary *</FieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="min-h-28"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select
                value={priority}
                onValueChange={(v) => setPriority((v as Priority) ?? "medium")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="highest">Highest</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="lowest">Lowest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Assignee</FieldLabel>
              <Select
                value={assigneeId}
                onValueChange={(v) => setAssigneeId(v ?? "unassigned")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter className="sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={createAnother}
              onChange={(e) => setCreateAnother(e.target.checked)}
              className="size-4 rounded border"
            />
            Create another
          </label>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0052CC] text-white hover:bg-[#0747A6]"
              onClick={handleCreate}
              disabled={!title.trim()}
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
