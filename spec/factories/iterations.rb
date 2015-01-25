FactoryGirl.define do
  factory :iteration do
    project_id 'id'
    time 20.00
    note 'test'
    start DateTime.now
  end
end