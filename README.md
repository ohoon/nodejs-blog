# nodejs-blog

목표:

  express.js를 기반으로 한 간단한 블로그 개발 (개인적인 공부용)

개발 노트:

  // 20.09.05
  
  express-generator로 기본 셋팅
  
  startbootstrap.com 에서 블로그형 템플릿 받아서 적용함
  
  하지만 홈 화면에 해당되는 템플릿이 없어 블로그 템플릿 참고하여 홈화면 템플릿 구현해야함
  
  홈화면 구조 (구현 예정) : 상단 >> 메인 배너, 하단 >> 최근 글 목록, 우측 >> 카테고리란(클릭 시 각 카테고리에 해당하는 블로그 포스트 목록으로 진입)

  // 20.09.06

  기존 홈화면 템플릿을 Post의 리스트에 이용할 예정이므로 옮기고

  홈화면에 메인 배너와 최근 글 목록을 볼 수 있게 템플릿을 구현함

  네비게이션 메뉴 Posts에 드롭다운메뉴를 적용해서 카테고리별로 이동할 수 있도록 세팅함

  URL은 /posts/  => 전체 글 목록, /posts/category/카테고리명 => 카테고리에 해당하는 글 목록

  // 20.09.07

  Mysql를 이용해서 Post의 데이터들을 저장함

  우선 CRUD에서 Create, Read만 구현함

  홈화면에서 최근 글 목록을 확인할 수 있고

  블로그화면에서 전체 글 목록을 확인할 수 있고 New 버튼으로 글 작성 페이지로 넘어가서 Create 가능하게끔 구현함

  다음 작업 때는 Update와 Delete을 우선적으로 구현할 예정

  // 20.09.08
  
  Update, Delete 하기 전에 먼저 글 보기 페이지를 구현하고자 함

  Read More 버튼을 누르면 글의 id를 Where조건으로 하여 글의 제목, 내용을 추출해서 보여줌

  댓글 기능도 마찬가지로 CRUD 이후에 구현 예정

  // 20.09.09

  글 보기 페이지 아래쪽에 Edit, Delete, Back 버튼 추가

  Edit의 경우는 버튼 클릭 시 Edit Form 화면으로 넘어가서 해당 글의 데이터를 불러오고 수정.
  
  그 후에 submit하면 HTTP method의 PUT으로 데이터를 받아 Mysql에서 Update 처리하고 해당 글로 redirect

  Delete의 경우는 버튼 클릭 시 삭제하겠냐는 경고창을 띄우고 예. 라고 답할 시 HTTP method의 DELETE로 글 번호를 받아 Mysql에서 Delete 처리하고 글 목록으로 redirect

  다음 작업 때는 간단하게 회원가입과 로그인을 할 수 있도록 구현할 예정

  // 20.09.10

  상단 nav 바에 로그인/ 회원가입 버튼을 만들고 회원가입 버튼을 누르면 회원가입 페이지로 넘어감

  개인정보를 입력하고 SIGN UP 버튼을 누르면 users 테이블에 저장. 패스워드는 bcrypt로 암호화처리

  다음 작업 때는 로그인 페이지를 만들고 passport를 이용해서 사용자 로그인/세션을 구현할 예정