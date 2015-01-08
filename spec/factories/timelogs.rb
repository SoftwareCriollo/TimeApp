FactoryGirl.define do
  factory :timelog do
    project_id 'id'
    project_name 'CPF-Market'
    task_id '25G'
    comment 'Testing'
    time '30'
    user_id '345G'
    trello false
    iteration_id '340Y'
    value_ajust '500.00'
  end
end