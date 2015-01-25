FactoryGirl.define do
  factory :timelog do
    project_id 'id'
    project_name 'CPF-Market'
    task_id '25G'
    comment 'Testing'
    time 10
    user_id '345G'
    trello true
    value_ajust 1
  end
end