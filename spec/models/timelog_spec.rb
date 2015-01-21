require "rails_helper"

RSpec.describe Timelog, :type => :model do
	it { should respond_to(:time) }
	it { should respond_to(:comment) }
	it { should respond_to(:trello) }
	it { should respond_to(:task_id) }

  describe "validate" do

    describe "presence" do
      it { should validate_presence_of(:time) }
      it { should validate_presence_of(:comment) }
      it { should validate_presence_of(:trello) }
      it { should validate_presence_of(:task_id) }
    end
  end 
end