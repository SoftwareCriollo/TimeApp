class Timelog
  include Mongoid::Document

  field :project_id, type: String
  field :project_name, type: String
  field :task_id, type: String
  field :comment, type: String
  field :time, type: String
  field :user_id, type: String
  field :fecha, type: Date
  field :trello, type: Boolean, default: false
  field :iteration_id, type: String
  field :value_ajust, type: Float

  validates_presence_of :time, :comment, :trello, :task_id

end
