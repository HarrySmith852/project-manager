"use client"

import { use } from "react"

import { IssueDetailView } from "@/components/pm/issue-detail-view"

export default function IssuePage({
  params,
}: {
  params: Promise<{ issueKey: string }>
}) {
  const { issueKey } = use(params)
  return <IssueDetailView issueKey={issueKey} />
}
