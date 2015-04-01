require "rails_helper"

RSpec.describe ProjectManager, :type => :model do
  before do
    allow(Trello::Organization).to(
      receive(:find).and_return(Trello::Organization.new)
    )
  end
  let(:project_manager){ ProjectManager.new }

  describe ".boards" do
    before{ expect_any_instance_of(Trello::Organization).to receive(:boards).and_return([Trello::Board.new]) }
    it { project_manager.boards }
  end
  describe ".cards" do
    before{ expect_any_instance_of(Trello::Board).to receive(:cards).and_return([]) }
    before{ expect_any_instance_of(Trello::Board).to receive(:lists).and_return([]) }

    before{ allow(Trello::Board).to receive(:find).with(board_id).and_return(Trello::Board.new)}

    let(:board_id){ "board_id" }

    it { project_manager.cards_by_board(board_id)}
  end
end
