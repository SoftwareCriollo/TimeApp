class Iteration
  include Mongoid::Document

  field :project_id, type: String
  field :time, type: Float
  field :note, type: String
  field :start, type: Date, default: DateTime.now
  field :end_date, type: Date, default: DateTime.now


  validates_presence_of :start, :end_date, :time
  validates_numericality_of :time
  
end
